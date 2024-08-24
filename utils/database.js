import mongoose from 'mongoose';

let isConnected = false; // Globalna zmienna do śledzenia statusu połączenia

export const connectToDB = async () => {
	mongoose.set('strictQuery', true);

	if (isConnected) {
		try {
			// Sprawdź, czy połączenie jest nadal aktywne
			await mongoose.connection.db.admin().ping();
			return; // Jeśli połączenie jest aktywne, zakończ funkcję
		} catch (error) {
			console.log('Lost MongoDB connection, reconnecting...');
			isConnected = false; // Połączenie zostało utracone, ustaw isConnected na false
		}
	}

	if (!isConnected) {
		try {
			await mongoose.connect(process.env.MONGODB_URI, {
				dbName: 'share_prompt',
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});

			isConnected = true;
			console.log('MongoDB Connected');
		} catch (error) {
			console.log('Error connecting to MongoDB:', error);
			isConnected = false; 
		}
	}
};
