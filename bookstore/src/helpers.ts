export class Helper {
    getUniqueString(prefix: string): string {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const millis = now.getMilliseconds().toString().padStart(3, '0');
    
    const workerIdx = process.env.TEST_WORKER_INDEX || '0';

    return `${prefix}_${day}${hours}${minutes}${seconds}_${millis}_w${workerIdx}`;
    }
}