type Param = {
  doc: string;
  chapter: string;
};

const object: { paths: () => { params: Param }[] } = {
  paths: () => [
    { params: { doc: "foo", chapter: "1" } },
    { params: { doc: "foo", chapter: "1" } },
    { params: { doc: "bar", chapter: "1" } },
    { params: { doc: "bar", chapter: "1" } },
  ],
};
export default object;
