
import React, {useState, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import  './table.css';
export default function Table({dataKey,value = [], columns = [], actionTemplate, headerText, addItemTemplate, itemsName, loading}){
    const dt = useRef(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const header = (
        <>
        <div className="table-header">
            <h5 className="mx-0 my-1">{headerText}</h5>
            <span>
            <span className="p-input-icon-left search-bar">
                <i className="pi pi-search" />
                <InputText type="search"  onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
            {addItemTemplate && <span className="add-item-block">{addItemTemplate}</span>}
            </span>
            
        </div>
        {loading && <ProgressBar mode="indeterminate" style={{ height: '6px' }} />}
        </>
       
    );

    const colTemplate = (col, {field}) => col[field];
    return (
        <DataTable 
            ref={dt} 
            value={value}
            dataKey={dataKey} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate={"Showing {first} to {last} of {totalRecords} " + itemsName}
            globalFilter={globalFilter} header={header} responsiveLayout="scroll"  >
            {columns.map(col => (
                <Column key={col.field}  field={col.field} header={col.label} body={col.colTemplate || colTemplate} sortable style={col.styles || {}}></Column>
            ))}
            {actionTemplate?.template && <Column body={actionTemplate.template} exportable={false} style={{ minWidth: actionTemplate.minWidth }}></Column>}
        </DataTable>
    )
}