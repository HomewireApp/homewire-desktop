export namespace app {
	
	export class WireInfo {
	    id: string;
	    name: string;
	    joinStatus: string;
	    connectionStatus: string;
	
	    static createFrom(source: any = {}) {
	        return new WireInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.joinStatus = source["joinStatus"];
	        this.connectionStatus = source["connectionStatus"];
	    }
	}

}

