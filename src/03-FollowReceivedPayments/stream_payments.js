import EventSource from "eventsource";
const es = new EventSource(
  "https://horizon-testnet.stellar.org/accounts/GB7JFK56QXQ4DVJRNPDBXABNG3IVKIXWWJJRJICHRU22Z5R5PI65GAK3/payments",
);
es.onmessage = function (message) {
  var result = message.data ? JSON.parse(message.data) : message;
  console.log("New payment:");
  console.log(result);
};
es.onerror = function (error) {
  console.log("An error occurred!");
};
