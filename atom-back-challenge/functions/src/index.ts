import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Initialize Firebase Admin
admin.initializeApp();

const app = express();
const db = admin.firestore();

// Middleware
app.use(cors({ origin: true }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'API is running successfully'
  });
});

// Get tasks
app.get('/tasks', async (req, res) => {
  try {
    const { userId } = req.query;

    let query: any = db.collection('tasks');

    if (userId) {
      query = query.where('userId', '==', userId);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: tasks,
      message: 'Tasks retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving tasks'
    });
  }
});

// Create task
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    if (!title || !userId) {
      res.status(400).json({
        success: false,
        message: 'Title and userId are required'
      });
      return;
    }

    const newTask = {
      title,
      description: description || '',
      completed: false,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('tasks').add(newTask);
    const doc = await docRef.get();

    res.status(201).json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      },
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating task'
    });
  }
});

// Update task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const taskRef = db.collection('tasks').doc(id);
    const doc = await taskRef.get();

    if (!doc.exists) {
      res.status(404).json({
        success: false,
        message: 'Task not found'
      });
      return;
    }

    const updateData: any = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    await taskRef.update(updateData);
    const updatedDoc = await taskRef.get();

    res.json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      },
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task'
    });
  }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const taskRef = db.collection('tasks').doc(id);
    const doc = await taskRef.get();

    if (!doc.exists) {
      res.status(404).json({
        success: false,
        message: 'Task not found'
      });
      return;
    }

    await taskRef.delete();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task'
    });
  }
});

// Get user by email
app.get('/users/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const snapshot = await db.collection('users').where('email', '==', email).get();

    if (snapshot.empty) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const userDoc = snapshot.docs[0];
    res.json({
      success: true,
      data: {
        id: userDoc.id,
        ...userDoc.data()
      },
      message: 'User found successfully'
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user'
    });
  }
});

// Login or create user
app.post('/users/login-or-create', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    const snapshot = await db.collection('users').where('email', '==', email).get();

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      res.json({
        success: true,
        data: {
          id: userDoc.id,
          ...userDoc.data()
        },
        message: 'User logged in successfully'
      });
      return;
    }

    const newUser = {
      email,
      name: name || 'User',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('users').add(newUser);
    const doc = await docRef.get();

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      },
      message: 'User created and logged in successfully'
    });
  } catch (error) {
    console.error('Error in login-or-create:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request'
    });
  }
});

// Create user
app.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (!snapshot.empty) {
      res.status(409).json({
        success: false,
        message: 'User already exists'
      });
      return;
    }

    const newUser = {
      email,
      name: name || 'User',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('users').add(newUser);
    const doc = await docRef.get();

    res.status(201).json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      },
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
});

// Export the API as a Firebase Function (2nd generation)
export const api = onRequest({
  cors: true,
  region: 'us-central1'
}, app);