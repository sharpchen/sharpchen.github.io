type Path = {
    params: {
        docRoute: string;
    };
};

const object = {
    paths: (): Path[] => [
        { params: { docRoute: 'docker' } },
        { params: { docRoute: 'javascript' } },
        { params: { docRoute: 'sql' } },
        { params: { docRoute: 'csharpdesignpatterns' } },
        { params: { docRoute: 'articles' } },
        { params: { docRoute: 'vue3' } },
        { params: { docRoute: 'cesiumjs' } },
    ],
};

export default object;
