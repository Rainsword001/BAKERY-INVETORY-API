import express from 'express'
import { PORT } from './src/config/env.js'
import { DB } from './src/database/db.js'
import morgan from 'morgan'
import cors from 'cors'
import authRouter from './src/routes/auth.route.js'
import { errorHandler } from './src/middlewares/error.middleware.js'
import ingredientsRouter from './src/routes/ingredients.routes.js'
import productRouter from './src/routes/products.routes.js';
import orderRouter from './src/routes/order.routes.js'
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js'
import './src/jobs/lowStock.job.js';


const app = express()

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


// ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/ingredients', ingredientsRouter)
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter)



// error middleware
app.use(errorHandler);

// start server
app.listen(PORT, async() =>{
    await DB();
    console.log(`server is running`)
});

