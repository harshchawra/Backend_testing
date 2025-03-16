import Query from '../models/query.model.js';
import Notification from '../models/notification.model.js';
import { createNotification } from './createNotification.js';

export const findSimilarQueries = async (newQuery) => {
    try{
        const { location, category, productName, brandName, status } = newQuery;
    
    console.log("Searching for similar queries!!!");
    console.log("a");
    
    const oppositeStatus = status === 'lost' ? 'found' : 'lost';
    
    
    const potentialMatches = await Query.find({
        status: oppositeStatus,
        $or: [
            { location: { $regex: new RegExp(location, 'i') } },
            { category: { $regex: new RegExp(category, 'i') } },
            { productName: { $regex: new RegExp(productName, 'i') } },
            { brandName: { $regex: new RegExp(brandName, 'i') } }
        ]
    });
    console.log("b");
    
    const similarQueries = potentialMatches.filter(query => {
        let matchCount = 0;
        if (query.location.toLowerCase() === location.toLowerCase()) matchCount++;
        if (query.category.toLowerCase() === category.toLowerCase()) matchCount++;
        if (query.productName.toLowerCase() === productName.toLowerCase()) matchCount++;
        if (query.brandName.toLowerCase() === brandName.toLowerCase()) matchCount++;
        return matchCount >= 3;
    });
    console.log("c");
    
    if (similarQueries.length === 0) {
        return [];
    }
    console.log("d");
    
    const existingNotifications = await Notification.find({ user : newQuery.user }).distinct('similarQuery');
    console.log("e");
    
    // Remove already notified queries
    const newSimilarQueries = similarQueries.filter(query => !existingNotifications.includes(query._id.toString()));
    console.log("f");
    
    if(newSimilarQueries.length === 0 ){
        return [];
    }
    console.log("g");
    
    await Promise.all(newSimilarQueries.map(async (query) => {
        
        await createNotification(newQuery.user, query._id); // Notify the user who created the new query
        
        await createNotification(query.user, newQuery._id); // Notify the user who posted the existing query
        
    }));
    console.log("h");
    

    return newSimilarQueries;
    }
    catch(err){
        console.log("Error in finding similar queries. " , err);
    }
};
