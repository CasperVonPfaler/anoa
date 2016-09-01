# Anoa

## Local dev setup

1. Fork and clone repo
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The server will be available at localhost:5000

## Database stuff

- One database per channel.
- Databases contain 3 different kinds of docs.
  ```
  meta: {
    _id: 'meta'
    name: 'awesome channel name.'
    time: 27.04.2015
  }

  question {
    _id: 'question@ <unique id>,
    text: 'id this a question?'
    time: 27.04.2015
  }

  answer {
    _id: '@answer <parent question id> <unique id>'
    text: 'Yes that is a question.'
    time. 27.04.2015
  }
  ```  
- Answers keep track of their parents by including their
 id in their own id, handy for startkey queries.
- All docs are immutable and can not be changed after
 they have been created, this avoids conflicts.

