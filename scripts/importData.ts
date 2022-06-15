interface Organizer {
    name: string;
}

interface Event {
    name: string;
    isOutside: boolean;
    location: string;
    date: number;
    organizer: Organizer;
}

export const importData = () => {
    // Import the data in json format and save in database
};

importData();
