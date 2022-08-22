const List = {
  list: [
    {
      id: 1,
      title: "ID: 1",
      type: "number"
    },
    {
      id: 2,
      title: "Poradie: 4",
      type: "number"
    },
    {
      id: 3,
      title: "Zrus: false",
      type: "boolean"
    },
    {
      id: 4,
      title: "Dátum: 12.02.2022",
      type: "date"
    },
    {
      id: 5,
      title: "Čas: 11:11",
      type: "time"
    },
    {
      id: 6,
      title: "Poznamka: TOTO je poznamka",
      type: "textarea"
    },
  ],
  getList: function () {
    return (
      (localStorage.getItem("theList") &&
        JSON.parse(localStorage.getItem("theList"))) ||
      this.list
    );
  },
  saveList: (list) => {
    localStorage.setItem("theList", JSON.stringify(list));
  },
};

export default List;