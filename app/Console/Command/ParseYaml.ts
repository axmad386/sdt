import { Command } from "@lunoxjs/core/console";
import Yaml2json from "@adius/yaml2json";
import fs from "fs";
import stream from "stream";

class ParseYaml extends Command {
  protected signature = "yaml:parse";

  protected description = "Command description";

  public async handle() {
    // create stream from docs/swagger.yaml then convert in to json
    await fs
      .createReadStream(root_path("docs/swagger.yaml"))
      .pipe(new Yaml2json())
      .pipe(
        new stream.Transform({
          writableObjectMode: true,
          transform: (chunk, encoding, done) =>
            done(null, JSON.stringify(chunk, null, 2) + "\n"),
        }),
      )
      .pipe(fs.createWriteStream(root_path("docs/swagger.json")))
      .on("error", (e: any) => {
        console.log(e);
        return this.FAILURE;
      })
      .on("close", () => {
        return this.SUCCESS;
      });
    return this.KEEPALIVE;
  }
}

export default ParseYaml;
