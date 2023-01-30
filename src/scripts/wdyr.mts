if (
  process.env.NODE_ENV === 'development'
  && typeof window !== 'undefined'
  && process.env.NEXT_PUBLIC_WDYR === 'true'
) {
  const [React, whyDidYouRender] = await Promise.all([
    import('react'),
    import('@welldone-software/why-did-you-render')
  ])
  whyDidYouRender.default(React.default, {
    trackAllPureComponents: true
  })
}

// Enable whyDidYouRender to Component
// Component.whyDidYouRender = {
//   logOnDifferentValues: true,
//   customName: 'Menu'
// }