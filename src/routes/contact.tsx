import Cal, { getCalApi } from '@calcom/embed-react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import PageContainer from '../components/PageContainer'

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    ;(async function () {
      const cal = await getCalApi({ namespace: '30min' })
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' })
    })()
  }, [])

  return (
    <PageContainer>
      <div className="text-lg">
        Email me at{' '}
        <a className="link" href="mailto:adamp319@gmail.com">
          adamp319@gmail.com
        </a>
        , or book a time to chat below.
      </div>
      <Cal
        id="calcom-embed"
        className="w-full h-full -mt-48 md:-mt-16"
        namespace="30min"
        calLink="adamhp/30min"
        style={{
          overflow: 'hidden',
          height: '1000px',
        }}
        config={{ layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }}
      />
    </PageContainer>
  )
}
