import Writter from "../controllers/Writter";

const pdf = require('pdf-creator-node');
const fs = require('fs');

export default class PDFWritter implements Writter
{
    write = async (content: any) =>
    {
        const template = fs.readFileSync('./public/report_template.handlebars', 'utf8');
        var document = {
            html: template,
            data: {
                ...content
            },
            path: "./output.pdf"
        };
        var options = {
            format: "A3",
            orientation: "portrait",
            border: "25mm",
        };

        try
        {
            const res = await pdf.create(document, options);
            return res.filename;
        }
        catch(err)
        {
            console.log(err);
        }
    }
}