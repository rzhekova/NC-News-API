const createRef = (data, key, docs) => {
  return data.reduce((acc, currentDatum, index) => {
    acc[currentDatum[key]] = docs[index]._id;
    return acc;
  }, {});
};

const formatArticleData = (articleData, topicReference, userReference) => {
  return articleData.map(articleDatum => {
    const { created_by, topic: belongs_to } = articleDatum;
    return {
      ...articleDatum,
      created_by: userReference[created_by],
      belongs_to
    };
  });
};

const formatCommentData = (commentData, userReference, articleReference) => {
  return commentData.map(commentDatum => {
    const { created_by, belongs_to } = commentDatum;
    return {
      ...commentDatum,
      created_by: userReference[created_by],
      belongs_to: articleReference[belongs_to]
    };
  });
};

module.exports = { formatArticleData, createRef, formatCommentData };
