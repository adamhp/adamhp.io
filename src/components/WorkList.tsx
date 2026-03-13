import { motion } from 'motion/react'

interface WorkItem {
  title: string
  description: string
  link: string
}

export const WorkItem = ({ title, description, link }: WorkItem) => (
  <div className="rounded-lg p-4 transition-all hover:bg-background-darker cursor-pointer">
    <a href={link}>
      <dt className="font-semibold text-accent">{title}</dt>
      <dd className="col-span-2">{description}</dd>
    </a>
  </div>
)

export const WorkList = ({
  delay,
  workList,
}: {
  delay?: number
  workList: WorkItem[]
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      visible: {
        transition: {
          delayChildren: delay,
          staggerChildren: 0.1,
        },
      },
    }}
    className="space-y-4"
  >
    {workList.map((work) => (
      <motion.div
        key={work.title}
        variants={{
          hidden: { opacity: 0, x: 20 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <WorkItem {...work} />
      </motion.div>
    ))}
  </motion.div>
)
