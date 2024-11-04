import { SidebarTrigger } from './ui/sidebar';

export default function DashboardSectionTitle({ title }: { title: string }) {
  return (
    <div className='flex items-center justify-normal space-x-2 lg:space-x-0'>
      <SidebarTrigger className='lg:hidden' />{' '}
      <span className='font-bold lg:hidden'>|</span>
      <h2 className='text-2xl font-bold'>{title}</h2>
    </div>
  );
}
