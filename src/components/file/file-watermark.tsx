export default function FileWatermark() {
  return (
    <div
      className='fixed bottom-4 z-50 right-6 bg-white dark:bg-blue-900 px-2 py-1 rounded-lg shadow-md transition-opacity duration-300 opacity-50 hover:opacity-100'
      aria-label='DocuSend Watermark'
    >
      <span className='text-sm font-semibold text-blue-900 dark:text-blue-300'>
        Powered by DocuSend
      </span>
    </div>
  );
}
