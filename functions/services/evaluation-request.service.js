const request = require('request');
const { fromEvent } = require('graphcool-lib');

exports.createRequest = function createRequest(competencyId, evaluateeId, evaluatorId, message) {
  // create evaluation request in graphcool
  // initiate conversation with motion.ai
  return create(competencyId, evaluateeId, evaluatorId, message)
    .then(() => {
      return getUserById(evaluatorId)
    })
    .then(({User}) => {
      console.log('result', User.phoneNumber);
      if (User.phoneNumber) {
        return initiateConversation(User.phoneNumber);
      }
    });
};

function create(competencyId, evaluateeId, evaluatorId, message) {
  return query(`
    mutation createEvaluationRequest(
      $competencyId: ID!
      $evaluateeId: ID!
      $evaluatorId: ID!
      $comments: [EvaluationRequestcommentsComment!]
    ) {
      createEvaluationRequest(
        competencyId: $competencyId,
        evaluateeId: $evaluateeId,
        evaluatorId: $evaluatorId,
        comments: $comments
      ) {
        id
        competency {
          title
        }
        evaluatee {
          email
        }
        evaluator {
          email
        }
      }
    }
  `,
    {
      competencyId,
      evaluateeId,
      evaluatorId,
      comments: [{
        competencyId: competencyId,
        text: message,
        fromId: evaluateeId
      }]
    }
  )
}

function initiateConversation(phoneNumber) {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'POST',
      url: 'https://api.motion.ai/messageHuman',
      body: {
        key: '961bde545acca55aa2ca605b6cef4193',
        bot: 84792,
        startModule: 1204555,
        to: phoneNumber
      },
      json: true
    };

    request(options, function (error, response, body) {
      if (error) {
        reject(error);
      }

      console.log(body);

      resolve(body);
    });
  });
}

function getUserById(id) {
  return query(`
      query getUserById($id: ID!) {
        User (id: $id) {
          phoneNumber
        }
      }
    `,
    {
      id
    }
  )
}

function getUserByEmail(email) {
  return query(`
      query getUserByEmail($email: String!) {
        User (email: $email) {
          id
          displayName
          competencies {
            id
            title
            description
            comments {
              id
              text
              from {
                id
                displayName
              }
            }
          }
        }
      }
    `,
    {
      email
    }
  )
}

function query(query, variables) {

  const pat = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MDY2MDgwNzYsImNsaWVudElkIjoiY2o1YjJoc2Zmb3FqZjAxMTNldzA5a29mZSIsInByb2plY3RJZCI6ImNqNzZlYmc1cjFnNnkwMTU2bXllc2UwMWoiLCJwZXJtYW5lbnRBdXRoVG9rZW5JZCI6ImNqODRqanJ6bzAycmowMTg0a2l0NzV6ejAifQ.6DPh7dXzbx63UJKo7oYkoZnxielmE9kmxee3S9xZjzE';
  const projectId = 'cj76ebg5r1g6y0156myese01j';

  const event = {
    context: {
      graphcool: {
        projectId,
        pat
      }
    }
  };

  const api = fromEvent(event).api('simple/v1');

  return api.request(query, variables);
}
