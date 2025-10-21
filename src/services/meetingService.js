import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, arrayUnion, arrayRemove, getDoc, runTransaction } from 'firebase/firestore';
import { db } from './firebase';
import { sendMeetingNotification, sendMeetingCreatedNotification } from './notificationService';

/**
 * Creates a new study meeting in Firestore.
 * @param {object} meetingData - The data for the new meeting.
 * @returns {Promise<string>} The ID of the newly created meeting.
 */
// Create a new study meeting
export const createMeeting = async (meetingData) => {
  try {
    const docRef = await addDoc(collection(db, 'meetings'), {
      ...meetingData,
      participants: [meetingData.createdBy], // Creator is first participant
      participantIds: [meetingData.createdBy.id], // Add creator's ID to participantIds
      createdAt: new Date(),
      status: 'active'
    });
    
    // Send notification to creator
    await sendMeetingCreatedNotification(
      meetingData,
      meetingData.createdBy.email,
      meetingData.createdBy.name
    );
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};

/**
 * Retrieves all active study meetings from Firestore.
 * @returns {Promise<Array<object>>} An array of active meeting objects.
 */
// Get all active meetings
export const getAllMeetings = async () => {
  try {
    const q = query(
      collection(db, 'meetings'),
      where('status', '==', 'active'),
      orderBy('meetingTime', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting meetings:', error);
    throw error;
  }
};

/**
 * Searches for active meetings by course ID.
 * @param {string} courseId - The course ID to search for.
 * @returns {Promise<Array<object>>} An array of matching meeting objects.
 */
// Search meetings by course ID
export const searchMeetingsByCourse = async (courseId) => {
  try {
    const q = query(
      collection(db, 'meetings'),
      where('courseId', '==', courseId.toLowerCase()),
      where('status', '==', 'active'),
      orderBy('meetingTime', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error searching meetings:', error);
    throw error;
  }
};

/**
 * Adds a user to a study meeting using a transaction to prevent race conditions.
 * @param {string} meetingId - The ID of the meeting to join.
 * @param {string} userId - The ID of the user joining.
 * @param {string} userEmail - The email of the user joining.
 * @param {string} userName - The name of the user joining.
 * @returns {Promise<void>}
 */
// Join a meeting
export const joinMeeting = async (meetingId, userId, userEmail, userName) => {
  try {
    const meetingDataForNotification = await runTransaction(db, async (transaction) => {
      const meetingRef = doc(db, 'meetings', meetingId);
      const meetingDoc = await transaction.get(meetingRef);

      if (!meetingDoc.exists()) {
        throw new Error('Meeting not found');
      }

      const meetingData = meetingDoc.data();

      // Check if user is already in the meeting
      if (meetingData.participants?.some(p => p.id === userId)) {
        // We throw a specific error message to handle it gracefully in the UI
        throw new Error('You are already in this meeting');
      }

      // Check if the meeting is full
      if (meetingData.participants?.length >= meetingData.maxParticipants) {
        throw new Error('This meeting is full');
      }

      const newParticipant = {
        id: userId,
        email: userEmail,
        name: userName,
        joinedAt: new Date()
      };

      const updatedParticipants = [...(meetingData.participants || []), newParticipant];
      const updatedParticipantIds = [...(meetingData.participantIds || []), userId];

      transaction.update(meetingRef, {
        participants: updatedParticipants,
        participantIds: updatedParticipantIds
      });

      // Return data for notification
      return { ...meetingData, participants: updatedParticipants };
    });

    // Send notification after successful transaction
    if (meetingDataForNotification) {
      await sendMeetingNotification(
        meetingDataForNotification,
        userEmail,
        userName
      );
    }
  } catch (error) {
    console.error('Error joining meeting:', error);
    // Re-throw the error to be caught by the UI and display a toast message
    throw error;
  }
};

/**
 * Removes a user from a study meeting.
 * @param {string} meetingId - The ID of the meeting to leave.
 * @param {string} userId - The ID of the user leaving.
 * @returns {Promise<boolean>} True if the user successfully left.
 */
// Leave a meeting
export const leaveMeeting = async (meetingId, userId) => {
  try {
    const meetingRef = doc(db, 'meetings', meetingId);
    const meetingSnap = await getDoc(meetingRef);

    if (meetingSnap.exists()) {
      const meetingData = meetingSnap.data();
      const participantToRemove = meetingData.participants.find(p => p.id === userId);

      if (participantToRemove) {
        await updateDoc(meetingRef, {
          participants: arrayRemove(participantToRemove),
          participantIds: arrayRemove(userId) // Remove user's ID from participantIds
        });
      }
    }
    return true;
  } catch (error) {
    console.error('Error leaving meeting:', error);
    throw error;
  }
};

/**
 * Retrieves all meetings a user is a participant in.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<object>>} An array of meetings the user has joined.
 */
// Get user's meetings
export const getUserMeetings = async (userId) => {
  try {
    const q = query(
      collection(db, 'meetings'),
      where('participantIds', 'array-contains', userId),
      orderBy('meetingTime', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user meetings:', error);
    throw error;
  }
};
