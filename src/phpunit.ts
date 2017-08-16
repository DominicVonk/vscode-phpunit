import { tmpdir } from 'os';
import { join } from 'path';
import { spawn } from 'child_process';

interface Options {
    rootPath: string;
    tmpdir: string;
}

export class PHPUnit {
    public constructor(
        private options: Options = {
            rootPath: __dirname,
            tmpdir: tmpdir()
        }
    ) {}

    public run(filePath: string, output: any = null): Promise<string> {
        return new Promise((resolve) => {
            const command = 'C:\\ProgramData\\ComposerSetup\\vendor\\bin\\phpunit.bat';
            const xml = join(this.options.tmpdir, 'vscode-phpunit-junit.xml');
            const args = [
                filePath,
                '--log-junit',
                xml
            ];
            console.log(filePath);
            const process = spawn(command, args, {cwd: this.options.rootPath});
            const cb = (buffer: Buffer) => {
                if (output !== null) {
                    output.append(buffer.toString()); 
                }
            }
            
            process.stderr.on('data', cb);
            process.stdout.on('data', cb);
            process.on('exit', (code: string) => {
                resolve(xml);
            });
        });
    }
}