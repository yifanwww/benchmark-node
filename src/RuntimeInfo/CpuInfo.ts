import os from 'os';

import { exec } from '../Tools/exec';

export class CpuInfo {
    public name: string;
    public processors: number;
    public logicalCores: number;
    public plysicalCores: number;

    public constructor() {
        this.name = os.cpus()[0].model.trim();

        this.processors = this.getNumberOfProcesors();

        this.logicalCores = os.cpus().length;
        this.plysicalCores = this.getPlysicalCores();
    }

    private getNumberOfProcesors(): number {
        switch (process.platform) {
            case 'linux': {
                const output = exec('lscpu | egrep Socket');
                const index = output.indexOf(':');
                return Number.parseInt(output.slice(index + 1).trim(), 10);
            }

            case 'darwin': {
                const output = exec('system_profiler SPHardwareDataType | grep Processors');
                const index = output.indexOf(':');
                return Number.parseInt(output.slice(index + 1).trim(), 10);
            }

            case 'win32': {
                const output = exec('WMIC CPU Get Name');
                return output.split(os.EOL).length - 1;
            }

            default:
                return 0;
        }
    }

    private getPlysicalCores(): number {
        switch (process.platform) {
            case 'linux': {
                const output = exec('lscpu -p | egrep -v "^#" | sort -u -t, -k 2,4 | wc -l');
                return Number.parseInt(output, 10);
            }

            case 'darwin': {
                const output = exec('sysctl -n hw.physicalcpu_max');
                return Number.parseInt(output, 10);
            }

            case 'win32': {
                const output = exec('WMIC CPU Get NumberOfCores');
                return output
                    .split(os.EOL)
                    .slice(1)
                    .map((line) => Number.parseInt(line.trim(), 10))
                    .reduce((sum, number) => sum + number, 0);
            }

            default:
                return 0;
        }
    }

    public toString(): string {
        const processorsDesc = this.processors > 0 ? `${this.processors} CPU` : '';

        let coresDesc;
        if (this.logicalCores === 0 && this.plysicalCores === 0) {
            coresDesc = '';
        } else if (this.logicalCores === 1 && this.plysicalCores === 0) {
            coresDesc = '1 logical core';
        } else if (this.logicalCores === 0 && this.plysicalCores === 1) {
            coresDesc = '1 plysical core';
        } else if (this.logicalCores === 1 && this.plysicalCores === 1) {
            coresDesc = '1 logical core and 1 physical core';
        } else if (this.logicalCores > 1 && this.plysicalCores === 0) {
            coresDesc = `${this.logicalCores} logical cores`;
        } else if (this.logicalCores > 1 && this.plysicalCores === 1) {
            coresDesc = `${this.logicalCores} logical cores and 1 plysical core`;
        } else if (this.logicalCores === 0 && this.plysicalCores > 1) {
            coresDesc = `${this.plysicalCores} plysical cores`;
        } else if (this.logicalCores === 1 && this.plysicalCores > 1) {
            coresDesc = `1 logical core and ${this.plysicalCores} plysical cores`;
        } else if (this.logicalCores > 1 && this.plysicalCores > 1) {
            coresDesc = `${this.logicalCores} logical and ${this.plysicalCores} plysical cores`;
        }

        return [this.name, processorsDesc, coresDesc].filter(Boolean).join(', ');
    }
}
