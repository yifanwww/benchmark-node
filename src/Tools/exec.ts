import child from 'child_process';

export const exec = (cmd: string) => child.execSync(cmd, { encoding: 'utf-8' }).trim();
