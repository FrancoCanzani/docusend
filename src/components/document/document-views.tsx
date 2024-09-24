import DocumentViewsChart from './document-views-chart';
import DocumentViewsMap from './document-views-map';
import DocumentViewsTable from './document-views-table';
import { DocumentView } from '@/app/document/[documentId]/columns';

type DocumentViewsProps = {
  documentViews: DocumentView[];
};

export default function DocumentViews({ documentViews }: DocumentViewsProps) {
  return (
    <div className='space-y-6'>
      <DocumentViewsTable documentViews={documentViews} />
      <DocumentViewsChart documentViews={documentViews} />
      <DocumentViewsMap documentViews={documentViews} />
    </div>
  );
}
