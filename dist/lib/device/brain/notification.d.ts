import * as Models from '../../models';
export default class {
    private queueSize;
    private readonly brainUri;
    private readonly sensorValues;
    constructor(options: {
        url: string;
    });
    send(message: Models.MessageModel): Promise<any>;
    private decreaseQueueSize;
    private isDuplicateMessage;
    private updateCache;
    private empty;
    private extractTypeAndData;
}
