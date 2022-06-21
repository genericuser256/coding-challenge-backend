export const getCityFromLocation = (location: string): string => {
    // We probably would want some error checking here but...
    const [_, city] = location.split("|");
    return city;
};
