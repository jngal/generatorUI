// import React from 'react';
// import NumericTextBox from '../../coraWebComponents/forms/NumericTextBox';
// import Input from '../../coraWebComponents/forms/Input';

const initialData = {
  items: [
    {
      id: 'item-0',
      field: "NAZOV",
      // content: () => <>
      //   <Input
      //     title={"ID"}
      //     name={"ID"}
      //     // field={"IDcko"}
      //     onChange={() => { }}
      //     value={2}
      //     disabled={false}
      //   />
      // </>
    },
    {
      id: 'item-1',
      field: "ID",
      // content: () => <>
      //   <NumericTextBox
      //     name="Number"
      //     tooltip={"Number"}
      //     title={"Number"}
      //     onChange={() => { }}
      //     value={123}
      //     spinners={false}
      //     placeholder="placeholder"
      //   /></>
    },
    {
      id: 'item-2',
      field: "POZN",
    },
    {
      id: 'item-3',
      field: "SKR",
    },
    {
      id: 'item-4',
      field: "DATUM",
    }
  ],
  columns: [
    {
      id: 'column-1',
      itemIds: ['item-0'],
    },
    {
      id: 'column-2',
      itemIds: ['item-1'],
    },
    {
      id: 'column-3',
      itemIds: ['item-4'],
    },
    {
      id: 'column-4',
      itemIds: ['item-2'],
    },
    {
      id: 'column-5',
      itemIds: ['item-3'],
    },
  ],
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3'],
  rows: [
    {
      id: 'row-1',
      columnIds: ['column-1', 'column-2', 'column-3' ]
    },
    {
      id: 'row-2',
      columnIds: ['column-4', 'column-5']
    }
  ],
  rowOrder: ['row-1', 'row-2'],
};

export default initialData;
