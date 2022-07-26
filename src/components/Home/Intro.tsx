import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import { MapPin } from 'react-feather'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'

function SectionTitle(props) {
  return (
    <p
      className="col-span-2 pt-8 text-lg font-extrabold text-black dark:text-white md:font-normal md:text-base md:pt-0 md:text-right md:text-opacity-40"
      {...props}
    />
  )
}

function SectionContent(props) {
  return <div className="col-span-10" {...props} />
}

interface TableRowProps {
  href: string
  title: string
  date: string
  subtitle?: string
}

function TableRow({ href, title, subtitle, date }: TableRowProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className="flex items-center space-x-4 group"
    >
      <span className="flex-none font-medium text-gray-1000 group-hover:underline group-hover:text-blue-600 dark:group-hover:text-blue-500 dark:text-gray-100">
        {title}
      </span>
      <span className="flex-shrink w-full border-t border-gray-300 border-dashed dark:border-gray-800" />
      {subtitle && <span className="flex-none text-tertiary">{subtitle}</span>}
      {date && (
        <span className="flex-none font-mono text-quaternary">{date}</span>
      )}
    </a>
  )
}

function SectionContainer(props) {
  return (
    <div
      className="grid items-start grid-cols-1 gap-6 md:grid-cols-12"
      {...props}
    />
  )
}

const workHistory = [
  {
    href: 'https://apple.com',
    title: '',
    subtitle: 'iOS Engineer',
    date: '2022—\u00a0\u00a0',
  },
  {
    href: 'https://kinandcarta.com',
    title: 'Kin + Carta',
    subtitle: 'iOS Engineer',
    date: '2019—22',
  },
  {
    href: 'https://swiftla.co',
    title: 'Swiftla',
    subtitle: 'Author',
    date: '2020—\u00a0\u00a0',
  },
]

const speakingData = [
  {
    href: 'https://uibreakfast.com/228-design-advisory-with-brian-lovin/',
    title: 'UI Breakfast',
    date: "Dec '21",
  },
]

export function Intro() {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  return (
    <Detail.Container data-cy="home-intro" ref={scrollContainerRef}>
      <TitleBar
        magicTitle
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
        title="Home"
      />

      {/* Keep this div to trigger the magic scroll */}
      <div className="p-4" ref={titleRef} />

      <Detail.ContentContainer>
        <div className="pb-24 space-y-8 md:space-y-16">
          <SectionContainer>
            <SectionTitle />
            <SectionContent>
              <div className="prose text-primary">
                <p>
                  Hey, I&apos;m Arvind. I&apos;m an engineer,{' '}
                  <Link href="/writing" passHref>
                    <a>writer</a>
                  </Link>
                  , software tinkerer, amateur photographer, and a terrible
                  musician.
                </p>
                <p>I also enjoy watching Formula 1 and making cocktails.</p>
              </div>
            </SectionContent>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Work</SectionTitle>
            <SectionContent>
              <div className="flex flex-col space-y-3">
                {workHistory.map((job) => (
                  <TableRow
                    href={job.href}
                    title={job.title}
                    subtitle={job.subtitle}
                    date={job.date}
                    key={job.href}
                  />
                ))}
              </div>
            </SectionContent>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Online</SectionTitle>
            <SectionContent>
              <div className="flex flex-col space-y-3">
                <TableRow
                  href={'https://twitter.com/arvindravi_'}
                  title={'Twitter'}
                  subtitle={'Follow'}
                  date={''}
                />
                <TableRow
                  href={'https://instagram.com/arvindravi_'}
                  title={'Instagram'}
                  subtitle={'Follow'}
                  date={''}
                />
              </div>
            </SectionContent>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Where</SectionTitle>
            <SectionContent>
              <div className="prose text-primary">
                <p>London, United Kingdom</p>
              </div>
            </SectionContent>
          </SectionContainer>
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
