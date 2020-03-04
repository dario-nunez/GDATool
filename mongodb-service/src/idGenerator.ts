/**
 * Helper function that generates valid Mongodb ids. They are not checked against
 * already existing ones in the dataset so duplicate key errors are theoretically
 * possible but realistically very unlikely.
 */
export function getMongoObjectId() {
    // tslint:disable-next-line:no-bitwise
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        // tslint:disable-next-line:no-bitwise
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
}