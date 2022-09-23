import os from 'os';

import { ConsoleLogger } from '../Tools/ConsoleLogger';
import { Optional } from '../types.internal';
import { CpuInfo } from './CpuInfo';

export class RuntimeInfo {
    static readonly version = '0.7.2';

    static readonly node = process.versions.node;
    static readonly v8 = process.versions.v8;

    static readonly platform = RuntimeInfo.getPlatform();

    private static _cpu: Optional<CpuInfo> = null;

    static get cpu(): CpuInfo {
        if (RuntimeInfo._cpu === null) {
            RuntimeInfo._cpu = new CpuInfo();
        }
        return RuntimeInfo._cpu;
    }

    private static getPlatform() {
        switch (process.platform) {
            case 'darwin':
                return `MacOS ${os.release()}`;
            case 'linux':
                return `Linux ${os.release()}`;
            case 'win32':
                return `Windows ${os.release()}`;

            default:
                return 'unknown';
        }
    }

    static log() {
        const logger = ConsoleLogger.default;
        logger.writeLineInfo(`BenchmarkNode v${RuntimeInfo.version}, ${RuntimeInfo.platform}`);
        logger.writeLineInfo(RuntimeInfo.cpu.toString());
        logger.writeLineInfo(`Node.JS ${RuntimeInfo.node} (V8 ${RuntimeInfo.v8})`);
        logger.writeLine();
    }
}
