# Yandex Speech Promise

This is a promise based implementation of Yandex Speech Kit API

### Usage

**Example**:

```JS
const { text2speech, speech2text } = require('yandex-speech-promise')
const auth = "Api-Key ..."

text2speech("Привет мир!", { auth })
  .then((audio) => speech2text(audio, { auth }))
  .then((text) => console.log(text)) // привет мир
```
