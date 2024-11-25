import math
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

class TfidfVectorAndCosine:
    def __init__(self):
        self.tfidf_model = {}
        self.tfidf_model['idf'] = {} 
    
    def cal_tf(self, term, document):
        return document.count(term) / len(document)
    
    def cal_idf(self, term, documents):
        doc_frequency = sum(1 for doc in documents if term in doc)
        return math.log((1 + len(documents)) / (1 + doc_frequency))
    
    def fit(self, documents):
        self.tfidf_model['terms'] = list(set(term for doc in documents for term in doc))
        for term in self.tfidf_model['terms']:
            self.tfidf_model['idf'][term] = self.cal_idf(term, documents)
    
    def transform(self, doc):
        tfidf_vector = []
        for term in self.tfidf_model['terms']:
            tf = self.cal_tf(term, doc)
            idf = self.tfidf_model['idf'][term]
            tfidf_vector.append(tf * idf)
        return np.array(tfidf_vector)
    
    def cosine_similarity(self, vector1, vector2):
        dot_product = np.dot(vector1, vector2)
        norm1 = np.linalg.norm(vector1)
        norm2 = np.linalg.norm(vector2)
        return dot_product / (norm1 * norm2)


def preprocessed(document):
    tokens = word_tokenize(document.lower())
    stop_words = set(stopwords.words('english'))
    filtered_words = [token for token in tokens if token not in stop_words]
    stemmer = PorterStemmer()
    stemmed_tokens = [stemmer.stem(token) for token in filtered_words]
    return stemmed_tokens  # Return as a list of tokens


# documents = [
#     "This is the first document. It's for preprocessing!",
#     "Here is another document, containing different words.",
#     "The third document is here, and it is quite unique."
# ]

# # Preprocess the documents
# preprocessed_documents = [preprocessed(document) for document in documents]

# # Apply TF-IDF
# tf_idf_vector = TfidfVectorAndCosine()
# tf_idf_vector.fit(preprocessed_documents)

# # Transform the preprocessed document
# tfidf_vectors = [tf_idf_vector.transform(doc) for doc in preprocessed_documents]

# print("tfidf vectors ",tfidf_vectors)
# cosine_sim = tf_idf_vector.cosine_similarity(tfidf_vectors[2], tfidf_vectors[1])
# print(f"Cosine Similarity between document 1 and document 2: {cosine_sim}")

