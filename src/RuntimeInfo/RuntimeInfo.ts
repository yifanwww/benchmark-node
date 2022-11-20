import os from 'os';

import { CpuInfo } from './CpuInfo';

export class RuntimeInfo {
    /** The version of `benchmark-node`. */
    static readonly version = '0.8.0-next.0';

    static readonly versions: Readonly<NodeJS.ProcessVersions> = process.versions;

    static readonly platform = RuntimeInfo.getPlatform();

    static readonly cpu = CpuInfo.instance;

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
}
