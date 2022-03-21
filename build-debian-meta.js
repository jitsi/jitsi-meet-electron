/* global process */

const { stat, readFile, writeFile, rename } = require('fs/promises');
const { createHash } = require('crypto');
const packageJson = require('./package.json');

exports.default = async function(context) {
    const dateFormat = await import('dateformat');

    const { outDir } = context;

    if (process.platform !== 'linux') {
        return;
    }

    const triplet = `${packageJson.name}_${packageJson.version}_amd64`;
    const debName = `${outDir}/${triplet}.deb`;
    const buildInfo = `${outDir}/${triplet}.buildinfo`;
    const changes = `${outDir}/${triplet}.changes`;
    const sizeInBytes = (await stat(debName)).size;
    const debfile = await readFile(debName);
    const md5sum = createHash('md5').update(debfile)
.digest('hex');
    const sha1sum = createHash('sha1').update(debfile)
.digest('hex');
    const sha256sum = createHash('sha256').update(debfile)
.digest('hex');
    let template = (await readFile(`${outDir}/../debian/${packageJson.name}.buildinfo`)).toString();

    template = template.replace(/__SIZE__/g, sizeInBytes);
    template = template.replace(/__FILE__/g, debName);
    template = template.replace(/__NAME__/g, packageJson.name);
    template = template.replace('__VERSION__', packageJson.version);
    template = template.replace('__DATE__', dateFormat.default(new Date(), 'ddd, dd mmm yyyy HH:MM:ss o'));
    template = template.replace('__MD5__', md5sum);
    template = template.replace('__SHA1__', sha1sum);
    template = template.replace('__SHA256__', sha256sum);
    await writeFile(buildInfo, template);

    await rename(`${outDir}/../${triplet}.changes`, changes);

    return [ buildInfo, changes ];
};
