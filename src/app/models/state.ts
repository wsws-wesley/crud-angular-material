export interface State {
	id: number;
	sigla: string;
	nome: string;
	regiao: {
		id: number,
		sigla: string,
		nome: string
	}
}