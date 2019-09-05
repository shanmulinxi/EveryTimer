const TABLE = {
    "base_user":"base_user",
} 

function get_table(name){
    const tab = TABLE[name]
    if(tab){
        return tab
    }else{
        return null
    }
    
}
exports.g_table = get_table