// const formatData = (data, formatter) => {
//   return data.map(formatter);
// };

const createRef = (data, key, docs) => {
  return data.reduce((acc, currentDatum, index) => {
    acc[currentDatum[key]] = docs[index]._id;
    return acc;
  }, {});
};

// const exchangeIDs = (oldItem, ref) => {

// }

const formatArticleData = (articleData, topicReference, userReference) => {
  return articleData.map(articleDatum => {
    const {}
  });
  // destructuring article data
};

module.exports = { formatArticleData, createRef };
