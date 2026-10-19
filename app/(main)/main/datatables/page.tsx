'use client'

import { useState } from 'react';

import DataTable, { Column } from 'datatables.net-react';
import DtCore from 'datatables.net-dt';
import 'datatables.net-dt/css';

DataTable.use(DtCore);

export default function Page() {
  
  const [rows, setRows] = useState([
    { id: 1, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', releaseDate: '2017-03-16', price: 29.99, finished: true },
    { id: 2, title: 'The Phoenix Project', author: 'Gene Kim et al.', releaseDate: '2013-01-15', price: 14.95, finished: true },
    { id: 3, title: 'Project Hail Mary', author: 'Andy Weir', releaseDate: '2021-05-04', price: 18.00, finished: false },
    { id: 4, title: 'Refactoring (2nd Ed)', author: 'Martin Fowler', releaseDate: '2018-11-20', price: 24.50, finished: false },
    { id: 5, title: 'Staff Engineer', author: 'Will Larson', releaseDate: '2021-03-08', price: 12.99, finished: true },
  ]);

  return (
    <main>
      <div>
        datatables
      </div>
      <DataTable data={rows} className="display">
        <Column title="Title" data="title" />
        <Column title="Author" data="author" />
        <Column title="Released" data="releaseDate" render={DtCore.render.date()} />
        <Column title="Price" data="price" render={DtCore.render.number(null, null, 2, '$')} />
        <Column title="Status" data="finished">
            {finished => (finished ? '✓ Read' : '⏳ Unread')}
        </Column>
    </DataTable>
    </main>
  );
}
