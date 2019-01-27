export class Delay {
    async delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
