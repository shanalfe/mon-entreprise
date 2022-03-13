import { Grid } from '@mui/material'
import { useSearchFieldState } from '@react-stately/searchfield'
import {
	FabriqueSocialEntreprise,
	searchDenominationOrSiren,
} from '@/api/fabrique-social'
import { Card } from '@/design-system/card'
import { SearchField } from '@/design-system/field'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import useSearchCompany from '@/hooks/useSearchCompany'
import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import CompanySearchDetails from './SearchDetails'
import { FromTop } from '../ui/animate'

const StyledCard = styled(Card)`
	flex-direction: row; // for Safari <= 13
`

export function CompanySearchField(props: {
	label?: ReactNode
	onValue?: () => void
	onClear?: () => void
	onSubmit?: (établissement: FabriqueSocialEntreprise) => void
}) {
	const { t } = useTranslation()

	const searchFieldProps = {
		...props,
		label: t('CompanySearchField.label', "Nom de l'entreprise, SIREN ou SIRET"),
		description: t(
			'CompanySearchField.description',
			'Le numéro Siret est un numéro de 14 chiffres unique pour chaque entreprise. Ex : 40123778000127'
		),
		onSubmit(value: string) {
			// This should probably click on the first item of the list of values...
			// Or use the current set of results...
			searchDenominationOrSiren(value).then((result) => {
				if (!result || result.length !== 1) {
					return
				}
				props.onSubmit?.(result[0])
			})
		},
		placeholder: t(
			'CompanySearchField.placeholder',
			'Café de la gare ou 40123778000127'
		),
	}

	const state = useSearchFieldState(searchFieldProps)

	const { onValue, onClear } = props
	useEffect(
		() => (!state.value ? onClear?.() : onValue?.()),
		[state.value, onValue, onClear]
	)

	const [searchPending, results] = useSearchCompany(state.value)

	return (
		<Grid container>
			<Grid item xs={12}>
				<SearchField
					data-test-id="company-search-input"
					state={state}
					isSearchStalled={searchPending}
					onClear={onClear}
					{...searchFieldProps}
				/>
			</Grid>
			<Grid item xs={12}>
				{state.value && !searchPending && (
					<Results results={results} onSubmit={props.onSubmit} />
				)}
			</Grid>
		</Grid>
	)
}

function Results({
	results,
	onSubmit,
}: {
	results: Array<FabriqueSocialEntreprise>
	onSubmit?: (établissement: FabriqueSocialEntreprise) => void
}) {
	return !results.length ? (
		<FromTop>
			<MessageContainer>
				<Intro>Aucune entreprise correspondante trouvée</Intro>
				<Body>
					Vous pouvez réessayer avec votre SIREN ou votre SIRET pour un meilleur
					résultat
				</Body>
			</MessageContainer>
		</FromTop>
	) : (
		<FromTop>
			<Grid container spacing={2} data-test-id="company-search-results">
				{results.map((etablissement) => (
					<Grid key={etablissement.siren} item xs={12}>
						<StyledCard onPress={() => onSubmit?.(etablissement)} compact>
							<CompanySearchDetails entreprise={etablissement} />
						</StyledCard>
					</Grid>
				))}
			</Grid>
		</FromTop>
	)
}

const MessageContainer = styled.div`
	display: flex;
	flex-direction: column;
	background: ${({ theme }) => theme.colors.bases.primary[500]};
	margin-top: 0.4rem;
	padding: 0.6rem 1rem 0;
	border-radius: 0.3rem;

	${Intro}, ${Body} {
		margin-top: 0;
	}
`
