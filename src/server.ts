import { app } from './index'

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server executando na porta ${PORT}`);
});