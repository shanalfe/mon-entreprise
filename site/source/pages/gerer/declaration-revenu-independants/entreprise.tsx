import { DottedName } from '@/../../modele-social'
import { resetCompany } from '@/actions/companyActions'
import { CompanyDetails } from '@/components/company/Details'
import { CompanySearchField } from '@/components/company/SearchField'
import {
	WhenAlreadyDefined,
	WhenApplicable,
	WhenNotAlreadyDefined,
} from '@/components/EngineValue'
import PageHeader from '@/components/PageHeader'
import { FromTop } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, Intro, SmallBody } from '@/design-system/typography/paragraphs'
import { useSetEntreprise } from '@/hooks/useSetEntreprise'
import { Grid } from '@mui/material'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { SimpleField } from '../_components/Fields'
import { useProgress } from './_components/hooks'
import notHandled from './_components/undraw_access_denied_re_awnf.svg'
import illustration from './_components/undraw_fill_in_mie5.svg'

export const OBJECTIFS: DottedName[] = [
	'entreprise . SIREN',
	'entreprise . catégorie juridique . EI . auto-entrepreneur',
	'entreprise . catégorie juridique . SARL . unipersonnelle',
]

export default function Accueil() {
	const setEntreprise = useSetEntreprise()
	const sitePaths = useContext(SitePathsContext)
	const dispatch = useDispatch()
	const engine = useEngine()
	const progress = useProgress(OBJECTIFS)
	const showGoToNextStep =
		progress === 1 && engine.evaluate('DRI . cas exclus').nodeValue === null

	return (
		<>
			<Trans i18nKey="assistant-DRI.intro">
				<PageHeader picture={illustration}>
					<Intro>
						Nous vous accompagnons pour remplir votre{' '}
						<Strong>déclaration de revenu</Strong> sur{' '}
						<Link href="https://www.impots.gouv.fr/accueil">impot.gouv.fr</Link>
						.<br />
					</Intro>
					<Body>Répondez à ces quelques questions, à la fin vous aurez :</Body>
					<Ul>
						<Li>Les formulaires qui vous concernent</Li>
						<Li>
							La liste des cases qui vous concernent avec le montant à remplir
						</Li>
						<Li>
							Une estimation des cotisations sociales à payer à l'Urssaf en 2022
						</Li>
					</Ul>
				</PageHeader>
			</Trans>
			<Grid container>
				<Grid item lg={10} xl={8}>
					<WhenNotAlreadyDefined dottedName="entreprise . SIREN">
						<Message border={false} icon>
							<Body>
								Vous pouvez rechercher votre entreprise avec{' '}
								<Strong>votre nom</Strong>, le{' '}
								<Strong>nom de votre entreprise</Strong>, le SIREN ou le SIRET
							</Body>
						</Message>
						<CompanySearchField onSubmit={setEntreprise} />
					</WhenNotAlreadyDefined>
					<WhenAlreadyDefined dottedName="entreprise . SIREN">
						<CompanyDetails />

						<Button size="XS" light onPress={() => dispatch(resetCompany())}>
							<Trans>Modifier l'entreprise</Trans>
						</Button>
					</WhenAlreadyDefined>

					<SimpleField dottedName="entreprise . catégorie juridique . EI . auto-entrepreneur" />
					<SimpleField dottedName="entreprise . catégorie juridique . SARL . unipersonnelle" />

					<Spacing xxl />
				</Grid>
			</Grid>
			<Grid container>
				<Grid item lg={10} xl={8}>
					<WhenApplicable dottedName="DRI . cas exclus">
						<FromTop>
							<Message type="info">
								<Grid
									container
									justifyContent="center"
									spacing={3}
									alignItems="center"
								>
									<Grid
										item
										xs={6}
										md={3}
										sx={{ order: { md: 0, xs: 1, sm: 1 } }}
									>
										<img
											src={notHandled}
											alt=""
											css={`
												width: 100%;
												padding: 1rem;
											`}
										/>
									</Grid>
									<Grid item md={9}>
										<Markdown>
											{engine.evaluate('DRI . cas exclus').nodeValue as string}
										</Markdown>
									</Grid>
									<Grid item lg={2} />
									<Grid item md="auto">
										<Button color="tertiary" to={sitePaths.gérer.index}>
											Découvrir les simulateur et assistant pour mon entreprise
										</Button>
									</Grid>
									<Grid item>
										<SmallBody>
											Si vous souhaitez que cet assistant à la déclaration gère
											votre cas dans le futur, laissez-nous message en cliquant
											sur le bouton "Faire une suggestion" en bas de la page.
										</SmallBody>
									</Grid>
								</Grid>
							</Message>
						</FromTop>
					</WhenApplicable>
					{showGoToNextStep && (
						<FromTop>
							<Message border={false}>
								<Trans i18nKey="assistant-DRI.precision">
									<H3>Quelques précisions avant de continuer</H3>
									<Body>
										Pour faire votre déclaration de revenu, il faudra vous
										connecter sur{' '}
										<Link href="https://www.impots.gouv.fr/accueil">
											impot.gouv.fr
										</Link>{' '}
										à partir du <Strong>8 avril 2022</Strong>.
									</Body>
									<Body>
										Si vous faites remplir votre déclaration de revenu par votre
										expert-comptable, cet assistant peut quand même vous être
										utile pour connaître le{' '}
										<Strong>
											montant des cotisations sociales à payer en 2022
										</Strong>
									</Body>
								</Trans>
								<div
									css={`
										text-align: center;
									`}
								>
									<Spacing lg />
									<Button
										size="XL"
										to={sitePaths.gérer.déclarationIndépendant.imposition}
									>
										Continuer avec cette entreprise
									</Button>
									<Spacing lg />
								</div>
							</Message>
						</FromTop>
					)}
				</Grid>
			</Grid>
		</>
	)
}
