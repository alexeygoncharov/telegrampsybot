 const axios = require('axios');
 var https = require('follow-redirects').https;
 var fs = require('fs');



const config = {
    completionURL: (engine) => {
        if (!engine) {
            engine = 'davinci';
        }
        return `https://api.openai.com/v1/engines/${engine}/completions`;
    },
    generateURL: (engine) => {
        if (!engine) {
            engine = 'davinci';
        }
        return `https://api.openai.com/v1/engines/${engine}/generate`;
    },
    searchURL: (engine) => {
        if (!engine) {
            engine = 'davinci';
        }
        return `https://api.openai.com/v1/engines/${engine}/search`;
    }
};

class OpenAI {
    constructor(api_key) {
        this._api_key = process.env.OPEN_AI_TOKEN;
        console.log(this._api_key);
    }

    _safe_cast(number) {
        return isNaN(Number(number)) ? null : Number(number);
    }

    _construct_parameter(name, value) {
        return (typeof value === 'undefined' || value === null) ? null : { [name]: value };
    }

    _send_request(opts) {
        const url = config.completionURL(opts.engine);
        const reqOpts = {
            headers: {
                'Authorization': `Bearer ${this._api_key}`,
                'Content-Type': 'application/json'
            }
        };

        const data = Object.assign({}, opts);

        console.log("GPT-3:" + url + " options: " + JSON.stringify(reqOpts) + "data: ");
        console.log('data_prompt', data.prompt)
        return axios.post(url, data, {...reqOpts}).catch(e => {
            console.log('Error Occured: '+ console.log(e));
        });
    }

    complete(opts) {
        return this._send_request(opts);
    }

    generate(opts) {
        console.log('CODE', encodeURIComponent(opts.promt))
        var options = {
            'method': 'GET',
            'hostname': 'api.openai.com',
            'path': `/v1/engines/davinci/generate?best_of=1&completions=1&context=${encodeURIComponent(opts.promt)}&frequency_penalty=0&length=160&presence_penalty=0.6&temperature=0.9&top_p=1&stop=%0A&stop=%20Human%3A&stop=%20AI%3A`,
            'headers': {
                'Authorization': `Bearer ${process.env.OPEN_AI_TOKEN}`,
                'authority': 'api.openai.com',
                'accept': 'text/event-stream',
                'openai-organization': 'org-Xr8jCXip4STAkkKd2gKk4zsg',
            },
            'maxRedirects': 20
        };

        return new Promise(function(resolve, reject) {
            var req = https.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    //console.log('original:', chunk);
                    chunks.push(chunk);
                });

                res.on("end", function (chunk) {
                    var body = chunks;
                    resolve(body);
                });

                res.on("error", function (error) {
                    console.error(error);
                });
            });

            req.end();
        })

    }

    search(opts) {
        const url = config.searchURL(opts.engine);
        const reqOpts = {
            headers: {
                'Authorization': `Bearer ${this._api_key}`,
                'Content-Type': 'application/json'
            }
        };
        const data = {
            documents: opts.documents,
            query: opts.query
        };
        console.debug("GPT-3:" + url + " data" + JSON.stringify(data) + "options: " + JSON.stringify(reqOpts));
        return axios.post(url, data, reqOpts);
    }
}

module.exports = new OpenAI();
