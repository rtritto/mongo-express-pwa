const DbPage = ({ dbName /* data, letters, query */ }) => {
  return (
    <>
      DbPage
    </>
  )
}

export async function getServerSideProps({ params: { dbName }, query }) {
  // const match = letterPage.match(GALLERY_LETTER_PAGE_REGEX)

  // if (match) {
  // 	const { groups: { letter, page } } = match

  // 	const { airing, type } = query

  // 	const airingVal = airing && airing === 'true'

  // 	const [letters, data] = await Promise.all([
  // 		((airingVal === undefined && type === undefined)
  // 			? getViewAnimesLettersAiring()
  // 			: getAnimesLetters(true, airingVal, type)),
  // 		getAnimesPageByLetter(page - 1, letter, true, airingVal, type)
  // 	])

  // 	if (data.results.length === 0) {
  // 		return {
  // 			notFound: true	// 404 Error Page
  // 		}
  // 	}

  return {
    props: {
      // data,
      dbName
      // query
    }
  }
  // }

  // return {
  // 	notFound: true	// 404 Error Page
  // }
}

export default DbPage