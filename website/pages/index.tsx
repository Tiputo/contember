import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import Blocks from '../components/blocks'
import Footer from '../components/footer'
import Header from '../components/header'
import Seo from '../components/seo'
import { serverSideFetch } from '../lib/graphql/gqlfetch'
import getHomePage from '../lib/graphql/queries/getHomePage'
import style from '../styles/homePage.module.sass'


export default function Home(props: any) {
	const homePageData = props.data?.getPage
	const headerMenu = props.data?.getHeaderMenu
	const footerMenu = props.data?.getFooterMenu
	const setting = props.data?.getSetting
	const listPlayer = props.data?.listPlayer
	const listMatch = props.data?.listMatch

	if (props.errors) {
		return (
			<>
				{
					props.errors.map((error: { message: string, code: string }) => (
						<>
							<p>{error.message}</p>
							<p>{error.code}</p>
						</>
					))
				}
			</>
		)
	}

	const scoreHome = (player) => {
		let filteredTeams
		let arrayWithScore
		let scoreForHomeSide
		if (player.teams && player.teams.length > 0) {
			filteredTeams = player.teams.filter((team) => team.matchPlayerHome?.playerHome?.score)
			arrayWithScore = filteredTeams.map((team) => team.matchPlayerHome?.playerHome?.score)
			scoreForHomeSide = arrayWithScore.reduce((prevValue, currValue) => prevValue + currValue, 0)
		}
		return scoreForHomeSide;
	}

	const scoreAway = (player) => {
		let filteredTeams
		let arrayWithScore
		let scoreForAwaySide
		if (player.teams && player.teams.length > 0) {
			filteredTeams = player.teams.filter((team) => team.matchPlayerAway?.playerAway?.score)
			arrayWithScore = filteredTeams.map((team) => team.matchPlayerAway?.playerAway?.score)
			scoreForAwaySide = arrayWithScore.reduce((prevValue, currValue) => prevValue + currValue, 0)
		}
		return scoreForAwaySide;
	}

	const sumScore = (scoreHome, scoreAway) => {
		return scoreHome + scoreAway;
	}

	return (
		<>
			<Seo seo={homePageData?.seo} />
			<Head>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header menu={headerMenu} logo={setting?.logo} />

			<main>
				{listPlayer.map((player, index) => (
					<div key={index}>
						{player.nickname}
						{player.teams.map((team, indexTeam) => (
							<React.Fragment key={indexTeam}>
								<pre>{JSON.stringify(team, null, 2)}</pre>
							</React.Fragment>
						))}
					</div>
				))}
				<h1 className={style.title}>Stiga</h1>
				<div className={style.cards}>
					{listPlayer.map(player => (
						<div key={player.id} className={style.wrap}>
							<div className={style.card}>
								<div className={style.image}>{player.image?.url && (
									<Image src={player.image.url} width={player.image.width} height={player.image.height} alt={player.image.height} />
								)}
								</div>
								<div className={style.container}>
									<p>Jméno hráče: {player.firstname} {player.surname}</p>
									<p>Přezdívka hráče: {player.nickname}</p>
									<p>Počet vítězství:
									</p>
									<p>Počet zápasu: {player.teams.length}
									</p>
									<p>Celkové skóre:
										{sumScore(scoreHome(player), scoreAway(player))}
									</p>
									<p>Skóre za domácí:
										{/* @TODO: type data */}
										{scoreHome(player)}
									</p>
									<p>Skóre za hosty:
										{/* @TODO: type data */}
										{scoreAway(player)}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className={style.table}>
					{listMatch.map(match => (
						<table key={match.id} className={style.tableIn}>
							<thead>
								<tr>
									<th>Jméno domácího hráče</th>
									<th>Skóre</th>
									<th>Jméno venkovního hráče</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><div className={style.name}>{match.playerHome?.player.nickname}</div></td>
									<td><div>{match.playerHome?.score} : {match.playerAway?.score}</div></td>
									<td><div className={style.name}>{match.playerAway?.player.nickname}</div></td>
								</tr>
							</tbody>
						</table>
					))}
				</div>

				<Blocks blocks={homePageData?.blocks} />
			</main>

			<Footer menu={footerMenu} content={setting?.footerCopyright} />
		</>
	)
}

export async function getStaticProps() {
	const { data, errors } = await serverSideFetch(getHomePage)

	return {
		props: {
			data: data ?? null,
			errors: errors ?? null
		},
		revalidate: 10,
	}
}
