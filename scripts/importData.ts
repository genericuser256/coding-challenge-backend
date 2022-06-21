import { getDBConnection } from "../src/database";
import { Event, Person } from "../src/models";
import data from "../data/data.json";
import { addDays } from "date-fns";

//
// Notes:
// I'm unsure exactly what is meant by the requirements around it operating at scale and that things may not be complete
// As such, I've made a few assumptions:
// 1. The data will never be so large that importing it normally will cause problems
//    If it was we could create a buffered reader of the data, but this is rather complex
// 2. The data integrity refers more to events not being fully populated and it's ok to set defaults
//    if the info isn't present
//
// Additionally, with out knowing too much about the conditions it will be run under
// it doesn't make sense to optimize for memory or cpu capabilities.
// The basic idea I'll use is just making use of sequelizes batching functionality.
//

interface IImportedOrganizer {
    name: string;
}

interface IImportedEvent {
    // Assume name and organizer will always be there as they're the most important things
    // I.e. if the data is bad, you can still ask the organizer about the event to confirm
    name: string;
    organizer: IImportedOrganizer;

    isOutside?: boolean;
    location?: string;
    date?: string;
}

const defaultEvent: Required<Omit<IImportedEvent, "name" | "organizer">> = {
    isOutside: false,
    location: "CAN|TORONTO",
    date: addDays(new Date(), 5).toISOString(),
};

const importOrganizers = async (events: IImportedEvent[]) => {
    // Make it a set to remove duplications
    const organizerNames = new Set(
        events.map(({ organizer }) => organizer.name)
    );

    // I'm unsure why, but attempting to await Promise.all of the findOrCreate
    // would throw, so we need to do it one at a time like this
    const organizers: Person[] = [];
    for (const name of organizerNames) {
        const [person, _] = await Person.findOrCreate({ where: { name } });
        organizers.push(person);
    }

    return organizers.reduce((prev, curr) => {
        prev[curr.name] = curr;
        return prev;
    }, {} as Record<string, Person>);
};

const importEvents = async (
    events: IImportedEvent[],
    organizerMap: Record<string, Person>
) => {
    await Event.bulkCreate(
        events.map((event) => {
            return {
                name: event.name,
                organizerId: organizerMap[event.organizer.name].id,
                isOutside: event.isOutside || defaultEvent.isOutside,
                location: event.location || defaultEvent.location,
                date: new Date(event.date || defaultEvent.date),
            };
        })
    );
};

export const importData = async () => {
    console.time("import");
    console.timeLog("import", "Starting DB");
    await getDBConnection();
    console.timeLog("import", "DB started");

    console.timeLog("import", "Beginning import of organizers!");
    const organizerMap = await importOrganizers(data);
    console.timeLog("import", "Organizers imported!");

    console.timeLog("import", "Beginning import of events!");
    await importEvents(data, organizerMap);
    console.timeLog("import", "Events imported!");

    console.timeEnd("import");
};

importData();
