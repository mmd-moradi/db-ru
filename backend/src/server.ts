import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

import restaurantRoutes from './api/restaurant.routes';
import userRoutes from './api/user.routes';
import ticketRoutes from './api/ticket.routes';
import groupsRoutes from './api/group.routes';
import employeeRoutes from './api/employee.routes';
import menuItemRoutes from './api/menuItem.routes';
import categoryRoutes from './api/category.routes';
import menuRoutes from './api/menu.routes';
import ticketTypeRoutes from './api/ticketType.routes';
import priceRuleRoutes from './api/priceRule.routes';
import transactionRoutes from './api/transaction.routes';
import lockerRoutes from './api/locker.routes';
import lockerUsageRoutes from './api/lockerUsage.routes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/ticket-types', ticketTypeRoutes);
app.use('/api/price-rules', priceRuleRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/lockers', lockerRoutes);
app.use('/api/locker-usage', lockerUsageRoutes);


app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});
