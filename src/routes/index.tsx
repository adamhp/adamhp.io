import { WorkList } from '@/components/WorkList'
import { currentWork, pastWork } from '@/util/constants'
import { createFileRoute, Link } from '@tanstack/react-router'
import PageContainer from '../components/PageContainer'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <PageContainer>
      <section>
        <div className="space-y-4 text-xl">
          <p>
            Hey, I&apos;m Adam! I&apos;m a full-stack software engineer, and
            I&apos;ve spent the last ten years building software products and
            pursuing creativity.
          </p>
          <p>
            I like <Link to="/writing">writing</Link> and taking{' '}
            <a
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://adamhp.photos"
            >
              photos
            </a>
            , and I'm always open for a chat about software, creativity, or
            anything in between, so feel free to{' '}
            <a
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://cal.com/adamhp"
            >
              reach out.
            </a>
          </p>
        </div>
      </section>

      <section>
        <div className="space-y-4">
          <div className="border-b-2 border-line mb-8">
            <h1 className="font-mono uppercase">Current Work</h1>
          </div>
          <WorkList workList={currentWork} />
        </div>
      </section>

      <section>
        <div>
          <div className="border-b-2 border-line mb-8">
            <h1 className="font-mono uppercase">Past Work</h1>
          </div>
          <WorkList delay={0.1 * 3} workList={pastWork} />
        </div>
      </section>
    </PageContainer>
  )
}
