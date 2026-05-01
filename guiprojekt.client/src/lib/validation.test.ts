import { describe, it, expect } from 'vitest'
import { ValidationRules, parseServerError } from './validation'

describe('ValidationRules', () => {
  describe('navn', () => {
    it('should return error for empty string', () => {
      expect(ValidationRules.navn('')).toBe('Navn er påkrævet')
    })

    it('should return error for whitespace only', () => {
      expect(ValidationRules.navn('   ')).toBe('Navn er påkrævet')
    })

    it('should return error for null', () => {
      expect(ValidationRules.navn(null as any)).toBe('Navn er påkrævet')
    })

    it('should return error for undefined', () => {
      expect(ValidationRules.navn(undefined as any)).toBe('Navn er påkrævet')
    })

    it('should return error for single character', () => {
      expect(ValidationRules.navn('A')).toBe('Navn skal være mindst 2 tegn')
    })

    it('should return empty string for valid name', () => {
      expect(ValidationRules.navn('John Doe')).toBe('')
    })

    it('should return error for name over 100 characters', () => {
      const longName = 'A'.repeat(101)
      expect(ValidationRules.navn(longName)).toBe('Navn må maksimalt være 100 tegn')
    })

    it('should allow names with spaces', () => {
      expect(ValidationRules.navn('John Doe Smith')).toBe('')
    })

    it('should allow names with apostrophe', () => {
      expect(ValidationRules.navn("O'Brien")).toBe('')
    })

    it('should allow names with hyphen', () => {
      expect(ValidationRules.navn('Smith-Johnson')).toBe('')
    })

    it('should return error for names with numbers', () => {
      expect(ValidationRules.navn('John123')).toBe('Navn må kun indeholde bogstaver, mellemrum, apostrof og bindestreg')
    })

    it('should return error for names with special characters', () => {
      expect(ValidationRules.navn('John@Doe')).toBe('Navn må kun indeholde bogstaver, mellemrum, apostrof og bindestreg')
    })
  })

  describe('score', () => {
    it('should return error for null', () => {
      expect(ValidationRules.score(null)).toBe('Score er påkrævet')
    })

    it('should return error for undefined', () => {
      expect(ValidationRules.score(undefined)).toBe('Score er påkrævet')
    })

    it('should return error for NaN', () => {
      expect(ValidationRules.score(NaN)).toBe('Score er påkrævet')
    })

    it('should return error for negative score', () => {
      expect(ValidationRules.score(-1)).toBe('Score kan ikke være negativ')
    })

    it('should return error for score over 999', () => {
      expect(ValidationRules.score(1000)).toBe('Score må maksimalt være 999')
    })

    it('should return empty string for valid score', () => {
      expect(ValidationRules.score(5)).toBe('')
    })

    it('should return empty string for zero', () => {
      expect(ValidationRules.score(0)).toBe('')
    })
  })

  describe('differentPlayers', () => {
    it('should return error for same players', () => {
      expect(ValidationRules.differentPlayers('John', 'John')).toBe('Spillerne må ikke være ens')
    })

    it('should return error for same players (case insensitive)', () => {
      expect(ValidationRules.differentPlayers('john', 'JOHN')).toBe('Spillerne må ikke være ens')
    })

    it('should return empty string for different players', () => {
      expect(ValidationRules.differentPlayers('John', 'Jane')).toBe('')
    })

    it('should return empty string for empty strings', () => {
      expect(ValidationRules.differentPlayers('', '')).toBe('')
    })
  })

  describe('differentScores', () => {
    it('should return error for same non-zero scores', () => {
      expect(ValidationRules.differentScores(5, 5)).toBe('Poengene må ikke være lige - der skal være en vinder')
    })

    it('should return empty string for zero scores', () => {
      expect(ValidationRules.differentScores(0, 0)).toBe('')
    })

    it('should return empty string for different scores', () => {
      expect(ValidationRules.differentScores(5, 3)).toBe('')
    })
  })

  describe('validMatchResult', () => {
    it('should return error for equal scores', () => {
      expect(ValidationRules.validMatchResult(5, 5)).toBe('Poengene må ikke være lige')
    })

    it('should return empty string for different scores', () => {
      expect(ValidationRules.validMatchResult(5, 3)).toBe('')
    })
  })
})

describe('parseServerError', () => {
  it('should return Error message for Error instance', () => {
    const error = new Error('Test error')
    expect(parseServerError(error)).toBe('Test error')
  })

  it('should return string for string error', () => {
    expect(parseServerError('String error')).toBe('String error')
  })

  it('should parse validation errors', () => {
    const error = {
      errors: {
        navn: ['Navn er påkrævet'],
        score: ['Score er påkrævet']
      }
    }
    expect(parseServerError(error)).toBe('Navn er påkrævet, Score er påkrævet')
  })

  it('should parse error object', () => {
    const error = { error: 'Custom error' }
    expect(parseServerError(error)).toBe('Custom error')
  })

  it('should parse detail object', () => {
    const error = { detail: 'Detail error' }
    expect(parseServerError(error)).toBe('Detail error')
  })

  it('should parse message object', () => {
    const error = { message: 'Message error' }
    expect(parseServerError(error)).toBe('Message error')
  })

  it('should return default message for unknown error', () => {
    expect(parseServerError({})).toBe('En uventet fejl opstod')
  })
})