import { default as _files } from './Filesystem';
import Parser, { TestSuiteInfo } from './Parser';
import { PathLike } from 'fs';
import URI from 'vscode-uri';

export class TestSuiteCollection {
    private suites: Map<string, TestSuiteInfo> = new Map<
        string,
        TestSuiteInfo
    >();

    constructor(private files = _files, private parser = new Parser()) {}

    async load(uri: PathLike | URI = process.cwd()) {
        uri = this.files.asUri(uri);
        const files = await this.files.glob('**/*.php', {
            absolute: true,
            ignore: 'vendor/**',
            cwd: uri.fsPath,
        });

        await Promise.all(files.map(file => this.put(file)));

        return this;
    }

    async put(uri: PathLike | URI): Promise<TestSuiteCollection> {
        uri = this.files.asUri(uri);

        const suite = await this.parser.parse(uri);
        if (suite) {
            this.suites.set(uri.toString(), suite);
        }

        return this;
    }

    async get(uri: PathLike | URI) {
        uri = this.files.asUri(uri);

        if (!this.suites.has(uri.toString())) {
            await this.put(uri);
        }

        return this.suites.get(this.files.asUri(uri).toString());
    }

    all() {
        return this.suites;
    }
}