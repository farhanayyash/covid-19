CREATE TABLE cards (
	card_id serial PRIMARY KEY,
	Country VARCHAR ( 255 ),
	TotalConfirmed VARCHAR ( 255 ),
	TotalDeaths VARCHAR ( 255 ),
	TotalRecovered VARCHAR ( 255 ),
	Date TEXT
);