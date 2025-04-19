type postAnswer = {
  answerAuthor: string;
  answerId: number;
  answerText: string;
};

type Post = {
  postId: number;
  postText: string;
  postAuthor: string;
  postAnswers: postAnswer[];
};
